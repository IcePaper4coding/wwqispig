package service

import (
	"os"
	"os/signal"
	"sync"
	"syscall"
	"wwqispig/pkg/server"
)

// micro interface
type Service interface {
	Init(...Option)
	Options() ServiceOptions
	Servers() []server.Server
	Run() error
	String() string
}

type Option func(*ServiceOptions)

type service struct {
	opts ServiceOptions
	once sync.Once
}

func NewService(opts ...Option) Service {
	options := newOptions(opts...)

	return &service{
		opts: options,
	}
}

// Init initialises options. Additionally it calls cmd.Init
// which parses command line flags. cmd.Init is only called
// on first Init.
func (s *service) Init(opts ...Option) {
	// process options
	for _, o := range opts {
		o(&s.opts)
	}

	s.once.Do(func() {
		for _, o := range s.opts.Servers {
			if err := o.Init(server.Context(s.opts.Context), server.Exit(s.opts.Exit)); err != nil {
			}
		}
	})
}

func (s *service) Options() ServiceOptions {
	return s.opts
}

func (s *service) Servers() []server.Server {
	return s.opts.Servers
}

func (s *service) String() string {
	return "service"
}

func (s *service) Start() error {
	for _, fn := range s.opts.BeforeStart {
		if err := fn(); err != nil {
			return err
		}
	}

	for _, o := range s.opts.Servers {
		if err := o.Start(); err != nil {
			return err
		}
	}

	for _, fn := range s.opts.AfterStart {
		if err := fn(); err != nil {
			return err
		}
	}

	return nil
}

func (s *service) Stop() error {
	var gerr error
	for _, fn := range s.opts.BeforeStop {
		if err := fn(); err != nil {
			gerr = err
		}
	}

	for _, o := range s.opts.Servers {
		if err := o.Stop(); err != nil {
			return err
		}
	}

	for _, fn := range s.opts.AfterStop {
		if err := fn(); err != nil {
			gerr = err
		}
	}

	return gerr
}

func (s *service) Run() error {
	if err := s.Start(); err != nil {
		return err
	}

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGTERM, syscall.SIGINT, syscall.SIGQUIT)

	select {
	// wait on kill signal
	case <-ch:
		// wait on context cancel
	case <-s.opts.Context.Done():
		// wait sub server exit signal
	case <-s.opts.Exit:
	}

	return s.Stop()
}
