package utils

import (
	"bytes"
	"encoding/json"
)

func ParseJSON(b []byte, ret interface{}) error {
	r := bytes.NewReader(b)
	decoder := json.NewDecoder(r)
	decoder.UseNumber()
	return decoder.Decode(ret)
}
