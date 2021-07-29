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
	rootCmd.PersistentFlags().StringVarP(&cfgFile, "conf", "c", "",
		"config file containing args(default is $HOME/.demo.yaml)")
	cobra.OnInitialize(func() {
		//config.ParseConfig(cfgFile)
	})

	rootCmd.SetArgs(args)
	rootCmd.PersistentFlags().AddGoFlagSet(flag.CommandLine)
	rootCmd.AddCommand(ServerCmd())
	return rootCmd
}
