package server

import (
	"context"
)

type ServerOptions struct {
	// Other options for implementations of the interface
	// can be stored in a context
	Exit    chan struct{}
	Context context.Context
}

func Context(ctx context.Context) Option {
	return func(o *ServerOptions) {
		o.Context = ctx
	}
}

func Exit(exit chan struct{}) Option {
	return func(o *ServerOptions) {
		o.Exit = exit
	}
}
