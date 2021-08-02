package routes

import (
	"github.com/gin-gonic/gin"
)

type IRoutes interface {
	Init() error
	UnInit() error
	RegisterRoutes(engine *gin.Engine) error
}
