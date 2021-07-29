package controller

import (
	"io/ioutil"
	"net/http"
	"wwqispig/pkg/repo"
	"wwqispig/pkg/routes/api/request"
	"wwqispig/pkg/routes/api/response"
	"wwqispig/pkg/utils"

	"github.com/gin-gonic/gin"
)

type QueryDataController struct {
}

// post querydata/AllData  => get all data with id &jsonMap
func (*QueryDataController) AllData(ctx *gin.Context) {
	ctx.Status(200)
}

// post querydata/addDataById  => set data with id & jsonmap
func (*QueryDataController) AddDataById(ctx *gin.Context) {
	body, err := ioutil.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, "request error")
		return
	}
	req := new(request.AddDataReq)
	utils.ParseJSON(body, &req)
	if req == nil {
		ctx.JSON(http.StatusBadRequest, "request error")
		return
	}
	err = repo.GetQueryDataModel().AddDataById(req.Id, req.JsonMap)
	if req == nil {
		ctx.JSON(http.StatusBadRequest, "set mongo error")
		return
	}
	rsp := response.QueryDataRsp{
		Id:      req.Id,
		JsonMap: req.JsonMap,
	}
	ctx.JSON(200, rsp)
}

// post querydata/queryDataById  => get data with id
func (*QueryDataController) QueryDataById(ctx *gin.Context) {
	body, err := ioutil.ReadAll(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, "request error")
		return
	}
	req := new(request.QueryDataReq)
	utils.ParseJSON(body, &req)
	if req == nil {
		ctx.JSON(http.StatusBadRequest, "request error")
		return
	}
	info, err := repo.GetQueryDataModel().QueryDataById(req.Id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, "query mongo error")
		return
	}
	rsp := response.QueryDataRsp{
		Id:      info.Id,
		JsonMap: info.JsonMap,
	}
	ctx.JSON(200, response.GlobalRsp{
		Code: 100,
		Msg:  "王伟强大傻逼",
		Data: rsp,
	})
}
