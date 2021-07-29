package repo

import (
	"sync"
	"wwqispig/pkg/libs/dboperator"
	"wwqispig/pkg/model"
)

var (
	instanceQueryDataModel *QueryDataModel
	initQueryDataModelOnce sync.Once
)

type QueryDataModel struct {
	repo *dboperator.Repo
}

func GetQueryDataModel() *QueryDataModel {
	initQueryDataModelOnce.Do(func() {
		instanceQueryDataModel = &QueryDataModel{repo: dboperator.InitRepo()}
		// 创建索引
		// instanceQueryDataModel.createIndex()
	})
	return instanceQueryDataModel
}

func (q *QueryDataModel) AddDataById(id, jsonMap string) error {
	info := model.QueryData{
		Id:      id,
		JsonMap: jsonMap,
	}
	return q.repo.Insert(info)
}
