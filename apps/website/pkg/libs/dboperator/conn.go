package dboperator

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"wwqispig/config"

	"gopkg.in/mgo.v2"
	"gopkg.in/yaml.v2"
)

type Config struct {
	MongodbyamlConfig Mongodbyaml `yaml:"mongodb"`
	Engine            string      `yaml:"engine"`
}
type Mongodbyaml struct { // 配置文件里的类
	Host   string `yaml:"host"`
	User   string `yaml:"user"`
	Pwd    string `yaml:"pwd"`
	Dbname string `yaml:"dbname"`
	Cname  string `yaml:"cname"`
}

var Conf Config
var SqlDB *sql.DB
var mgoSession *mgo.Session

// 单独的连接
func PrimaryConnect() (*mgo.Session, *mgo.Database, string, error) {
	mongodbyamlConfig := new(Mongodbyaml)
	err := config.UnmarshalKey("mongodb", &mongodbyamlConfig)
	if err != nil {
		panic(err) // 直接终止程序运行
	}
	collection := mongodbyamlConfig.Cname
	if mgoSession == nil { // 如果还没开启，就开启线程池，否则直接从线程池中拿
		var err error
		mgoSession, err = mgo.Dial(Conf.MongodbyamlConfig.Host)
		if err != nil {
			panic(err) // 直接终止程序运行
		}
	}
	// 最大连接池默认为4096
	// return mgoSession.Clone() //获取连接池中的连接
	// 刷新重连
	err = mgoSession.Ping()
	if err != nil {
		mgoSession.Refresh()
	}
	db := mgoSession.DB(Conf.MongodbyamlConfig.Dbname)
	return mgoSession.Copy(), db, collection, err

}

func ReadConnect() (*mgo.Session, *mgo.Database, string, error) {
	Conf.GetConf()
	collection := Conf.MongodbyamlConfig.Cname
	if mgoSession == nil { // 如果还没开启，就开启线程池，否则直接从线程池中拿
		var err error
		mgoSession, err = mgo.Dial(Conf.MongodbyamlConfig.Host)
		if err != nil {
			panic(err) // 直接终止程序运行
		}
	}
	// 最大连接池默认为4096
	// return mgoSession.Clone() //获取连接池中的连接
	// 刷新重连
	err := mgoSession.Ping()
	if err != nil {
		mgoSession.Refresh()
	}
	db := mgoSession.DB(Conf.MongodbyamlConfig.Dbname)
	return mgoSession.Copy(), db, collection, err
}

func (c *Config) GetConf() *Config {
	yamlFile, err := ioutil.ReadFile("conf.yaml") // yaml解析的时候c.data如果没有被初始化，会自动为你做初始化
	if err != nil {
		fmt.Println(err.Error())
	}
	err = yaml.Unmarshal(yamlFile, c) // 把值装进c中
	if err != nil {
		fmt.Println(err.Error())
	}
	return c
}

// 异常检查
func CheckErr(err error) {
	if err != nil {
		log.Fatal(err)
		panic(err)
	}
}
