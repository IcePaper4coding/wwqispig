package dboperator

import (
	"gopkg.in/mgo.v2"
	_ "gopkg.in/mgo.v2"
)

type Repo struct {
	col *mgo.Collection
}

func InitRepo() *Repo {
	primarySession, db, collection, err := PrimaryConnect()
	CheckErr(err)                // 检查连接错误
	defer primarySession.Close() // 用完就把这个连接返回去
	c := db.C(collection)
	return &Repo{
		col: c,
	}
}

func (r *Repo) Insert(doc interface{}) error {
	return r.col.Insert(doc)
}

func (r *Repo) InsertMany(docs ...interface{}) error {
	return r.col.Insert(docs...)
}

func (r *Repo) FindOne(query, result interface{}) error {
	return r.col.Find(query).One(result)
}

func (r *Repo) FindAll(query, result interface{}) error {
	return r.col.Find(query).All(result)
}

func (r *Repo) Update(selector, update interface{}) error {
	return r.col.Update(selector, update)
}

func (r *Repo) UpdateAll(selector, update interface{}) error {
	_, err := r.col.UpdateAll(selector, update)
	return err
}

func (r *Repo) Remove(selector interface{}) error {
	return r.col.Remove(selector)
}

func (r *Repo) RemoveAll(selector interface{}) error {
	_, err := r.col.RemoveAll(selector)
	return err
}

func (r *Repo) Count(query interface{}) (int, error) {
	return r.col.Find(query).Count()
}
