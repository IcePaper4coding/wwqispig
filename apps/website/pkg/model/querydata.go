package model

type QueryData struct {
	Id      string `json:"id" bson:"id"`
	JsonMap string `json:"jsonmap" bson:"jsonmap"`
}
