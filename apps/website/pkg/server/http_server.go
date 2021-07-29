package server

import (
	_ "net/http/pprof"

	"github.com/gin-gonic/gin"
)

type httpServer struct {
	opts ServerOptions
}

func NewhttpServer() Server {
	//do server init
	return &httpServer{}
}

func (hs *httpServer) Options() ServerOptions {
	return hs.opts
}

// 注册路由以及接口层
func (hs *httpServer) Init(opts ...Option) error {
	for _, o := range opts {
		o(&hs.opts)
	}
	// 工厂初始化

	// 注册路由对象
	gin.SetMode(gin.ReleaseMode)

	return nil
}

// 项目启动初始化
func (this *httpServer) Start() error {

	return nil
}

// 项目结束反初始化
func (hs *httpServer) Stop() error {
	close(hs.opts.Exit)
	// if err := hs.routes.UnInit(); err != nil {
	// 	return err
	// }
	// hs.engine = nil
	return nil
}

func (hs *httpServer) String() string {
	return "httpServer"
}
