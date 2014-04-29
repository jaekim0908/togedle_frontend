app.factory("ParseService", function ($q) {
	

	var login = function (email, password) {
		var deferred = $q.defer();
		Parse.User.logIn(email, password, {
			success : function (result) {
				deferred.resolve(result);
			},
			error : function (result, error) {
				deferred.reject(error);
			}
		});

		return deferred.promise;
	};

	var register = function (newUser) {
		var deferred = $q.defer();
		var user = new Parse.User();
		console.log(newUser);
		user.set("firstName", newUser.firstName);
		user.set("lastName", newUser.lastName);
		user.set("email", newUser.email);
		user.set("username", newUser.email);
		user.set("password", newUser.password);
		user.signUp(null, {
			success : function (result) {
				deferred.resolve(result);
			},
			error : function (result, error) {
				deferred.reject(error);
			}
		});

		return deferred.promise;
	};
	
	var createProject = function (newProject) {
        var deferred = $q.defer();
        var Project = Parse.Object.extend("Project");
        var project = new Project();
        project.set("name", newProject.name);
        project.set("description", newProject.description);
        project.set("owner", newProject.user);
        project.save({
            success : function (result) {
                deferred.resolve(result);
            },
            error : function (result, error) {
                deferred.reject(error);
            }
        });

        return deferred.promise;
    };
    
    var getProjects = function (user) {
        var deferred = $q.defer();
        var getProjectsQuery = new Parse.Query(Parse.Object.extend("Project"));
        getProjectsQuery.equalTo("owner", user);
        getProjectsQuery.find({
            success : function (result) {
                deferred.resolve(result);
            },
            error : function (result, error) {
                deferred.reject(error);
            }
        });
        return deferred.promise;
    };

	return {
		login : login,
		register : register,
		createProject : createProject,
		getProjects : getProjects
	};
});
