package api

import (
	"wwqispig/pkg/routes/api/controller"
	"wwqispig/pkg/routes/api/middleware"

	"github.com/gin-gonic/gin"
)

type Routes struct {
	queryDataCtrl controller.QueryDataController
}

func (r *Routes) Init() error {
	return nil
}

func (r *Routes) UnInit() error {
	return nil
}

func (r *Routes) RegisterRoutes(engine *gin.Engine) error {
	// 全局中间件
	// engine.Use(middleware.EntranceMiddleware)
	// entryGroup0 := engine.Group("/api/v1", middleware.ClientMiddleware)
	groupOps := engine.Group("/querydata", middleware.CoresMiddleware)
	{
		groupOps.POST("/AllData", r.queryDataCtrl.AllData)
		groupOps.POST("/addDataById", r.queryDataCtrl.AddDataById)
		groupOps.POST("/queryDataById", r.queryDataCtrl.QueryDataById)
	}
	return nil
}
