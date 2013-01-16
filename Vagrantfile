Vagrant::Config.run do |config|
  config.vm.box = "precise64"

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = ["cookbooks/ci_environment"]
    chef.log_level = :debug

    chef.add_recipe "apt"
    chef.add_recipe "build-essential"
    chef.add_recipe "git"
    chef.add_recipe "nodejs::multi"
    chef.json.merge!({
      :apt => { :mirror => :ua },
      :nodejs => {
        :versions => ["0.8.16"],
        :aliases => { "0.8.16" => "0.8" },
        :default => '0.8.16'
      },
      :travis_build_environment => {
        :user => "vagrant",
        :group => "vagrant",
        :arch => 'amd64',
        :home => '/home/vagrant'
      }
   })
  end
end
