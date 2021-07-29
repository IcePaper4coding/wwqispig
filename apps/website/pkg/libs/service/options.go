package service

import (
	"context"
	"wwqispig/pkg/server"
)

type ServiceOptions struct {
	Servers []server.Server
	// Registry registry.Registry
	// Before and After funcs
	BeforeStart []func() error
	BeforeStop  []func() error
	AfterStart  []func() error
	AfterStop   []func() error
	// Other options for implementations of the interface
	// Can be stored in a context
	Context context.Context
	Exit    chan struct{}
}

// var DefaultServer server.Server = server.NewGrpcServer()
func newOptions(opts ...Option) ServiceOptions {
	opt := ServiceOptions{
		// Servers:  []server.Server{DefaultServer},
		Context: context.Background(),
		Exit:    make(chan struct{}),
	}

	for _, o := range opts {
		o(&opt)
	}

	return opt
}

func Server(s server.Server) Option {
	return func(o *ServiceOptions) {
		o.Servers = append(o.Servers, s)
	}
}

// Before and Afters
func BeforeStart(fn func() error) Option {
	return func(o *ServiceOptions) {
		o.BeforeStart = append(o.BeforeStart, fn)
	}
}

func BeforeStop(fn func() error) Option {
	return func(o *ServiceOptions) {
		o.BeforeStop = append(o.BeforeStop, fn)
	}
}

func AfterStart(fn func() error) Option {
	return func(o *ServiceOptions) {
		o.AfterStart = append(o.AfterStart, fn)
	}
}

func AfterStop(fn func() error) Option {
	return func(o *ServiceOptions) {
		o.AfterStop = append(o.AfterStop, fn)
	}
}
