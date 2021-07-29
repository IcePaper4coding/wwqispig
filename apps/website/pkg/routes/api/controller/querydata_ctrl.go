package controller

import (
	"github.com/gin-gonic/gin"
)

type QueryDataController struct {
}

// post querydata/AllData  => get all data with id &jsonMap
func (*QueryDataController) AllData(ctx *gin.Context) {
	ctx.Status(200)
}
