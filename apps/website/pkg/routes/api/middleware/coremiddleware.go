package middleware

import (
	"github.com/gin-gonic/gin"
)

type coresMiddleware struct {
}

// 全局初始化
var coresHandler *coresMiddleware

func init() {
	coresHandler = new(coresMiddleware)
}

// 跨域请求配置层
func CoresMiddleware(ctx *gin.Context) {
	coresHandler.handler(ctx)
}

// 入口
func (this *coresMiddleware) handler(ctx *gin.Context) {
	ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*") // 这是允许访问所有域
	ctx.Next()
}
