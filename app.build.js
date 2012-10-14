({
	appDir: "./require",
	baseUrl: "./",
	dir: "./require/compiled", 
	paths:{
		jquery: "empty:",
		"jquery-ui": "empty:",
		"jquery-ui.ru": "empty:",
		"handlebars": "empty:"
	},
	modules: [
		{
			name: "js/main"
		},
		{
			name: "js/print"
		},
	]
})