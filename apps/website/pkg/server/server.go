package server

// Server is a simple service abstraction
type Server interface {
	Options() ServerOptions
	Init(...Option) error
	//Handle(Handler) error
	//NewHandler(interface{}, ...HandlerOption) Handler
	Start() error
	Stop() error
	String() string
}

type Option func(*ServerOptions)
