package cmd

import (
	"flag"

	"github.com/spf13/cobra"
)

// GetRootCmd returns the root of the cobra command-tree.
func GetRootCmd(args []string) *cobra.Command {
	rootCmd := &cobra.Command{
		SilenceUsage: true,
		Args:         cobra.ExactArgs(0),
		PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
			return nil
		},
	}
	var cfgFile string
	// 配置command -conf -c 为读取配置文件参数
	rootCmd.PersistentFlags().StringVarP(&cfgFile, "conf", "c", "",
		"config file containing args(default is $HOME/.demo.yaml)")
	// OnInitialize设置在调用每个命令的Execute方法时要运行的传递函数。
	cobra.OnInitialize(func() {
		// config.ParseConfig(cfgFile)
	})

	rootCmd.SetArgs(args)
	rootCmd.PersistentFlags().AddGoFlagSet(flag.CommandLine)
	rootCmd.AddCommand(ServerCmd())
	return rootCmd
}
