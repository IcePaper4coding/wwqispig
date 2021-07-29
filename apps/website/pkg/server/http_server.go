package server

import (
	"fmt"
	_ "net/http/pprof"
	"wwqispig/config"
	"wwqispig/pkg/routes/api"

	"github.com/gin-gonic/gin"
)

type httpServer struct {
	opts   ServerOptions
	engine *gin.Engine
	routes *api.Routes
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
	hs.engine = gin.Default()
	hs.routes = new(api.Routes)
	// 注册接口
	if err := hs.routes.Init(); err != nil {
		return err
	}

	if err := hs.routes.RegisterRoutes(hs.engine); err != nil {
		return err
	}
	return nil
}

// 项目启动初始化
func (this *httpServer) Start() error {
	if err := this.engine.Run(fmt.Sprintf(":%d", config.GetInt("httpservice.port"))); err != nil {
		return err
	}
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
