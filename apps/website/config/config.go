package config

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/viper"
)

var (
	configuration = viper.New()
)

func ParseConfig(cfgFile string) {
	if len(cfgFile) > 0 {
		configuration.SetConfigFile(cfgFile)
	} else {
		configuration.SetConfigName(".demo")
		configuration.AddConfigPath("$HOME")
		configuration.AutomaticEnv()
	}

	if err := configuration.ReadInConfig(); err != nil {
		_, _ = os.Stderr.WriteString(fmt.Errorf("fatal errcode in config file: %s", err).Error())
		os.Exit(1)
	}
}

func Get(key string) interface{} {
	return configuration.Get(key)
}

func Set(key string, value interface{}) {
	configuration.Set(key, value)
}

func IsSet(key string) bool { return configuration.IsSet(key) }

func GetString(key string) string {
	return configuration.GetString(key)
}

func GetBool(key string) bool {
	return configuration.GetBool(key)
}

func GetInt(key string) int {
	return configuration.GetInt(key)
}

func GetInt32(key string) int32 {
	return configuration.GetInt32(key)
}

func GetInt64(key string) int64 {
	return configuration.GetInt64(key)
}

func GetUint(key string) uint {
	return configuration.GetUint(key)
}

func GetUint32(key string) uint32 {
	return configuration.GetUint32(key)
}

func GetUint64(key string) uint64 {
	return configuration.GetUint64(key)
}

func GetFloat64(key string) float64 {
	return configuration.GetFloat64(key)
}

func GetStringSlice(key string) []string {
	return configuration.GetStringSlice(key)
}

func GetDuration(key string) time.Duration {
	return configuration.GetDuration(key)
}

func GetTime(key string) time.Time {
	return configuration.GetTime(key)
}

func GetStringMap(key string) map[string]interface{} {
	return configuration.GetStringMap(key)
}

func GetStringMapString(key string) map[string]string {
	return configuration.GetStringMapString(key)
}

func GetStringMapStringSlice(key string) map[string][]string {
	return configuration.GetStringMapStringSlice(key)
}

func GetSizeInBytes(key string) uint {
	return configuration.GetSizeInBytes(key)
}

func UnmarshalKey(key string, rawVal interface{}) error {
	return configuration.UnmarshalKey(key, rawVal)

}
