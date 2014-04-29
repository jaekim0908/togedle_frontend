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

	return {
		login : login,
		register : register
	};
});
