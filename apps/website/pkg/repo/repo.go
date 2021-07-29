package repo

import (
	"sync"
	"wwqispig/pkg/libs/dboperator"
	"wwqispig/pkg/model"

	"gopkg.in/mgo.v2/bson"
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

func (q *QueryDataModel) QueryDataById(id string) (model.QueryData, error) {
	info := new(model.QueryData)
	if err := q.repo.FindOne(bson.M{"id": id}, &info); err != nil {
		return model.QueryData{}, nil
	}

	return *info, nil
}
