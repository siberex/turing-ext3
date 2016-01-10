var runMachine = function(states, data, stepCallback) {
	/*[
		{_:["_",  1, 1], 1:["1",  0, 2]},
		{_:["1",  1, 3], 1:["1",  1, 2]},
		{_:["_", -1, 4], 1:["1",  1, 3]},
		{_:false,		 1:["_", -1, 0]}
	]*/

	//for (var i = 0; i < states.length; i++) { 
		// TODO:
		// Проверка на существование точки выхода.
		// Есть ли в наборе состояний символы не из алфавита?
		// Есть ли на ленте символы не из алфавита?
	//}

	var pos = 0; // Позиция каретки
	var state = 1;
	var s;

	if (stepCallback) stepCallback(data, pos, state);

	// Основной цикл
	while (state != 0 || typeof STOP != 'undefined') {
		// Если каретка сдвинулась левее или правее существующей ленты, на этом месте печатается пустой символ
		if (pos == -1) {
			data = '_' + data;
			pos = 0;
		} else if (pos == data.length) {
			data += '_';
		}
		s = data[pos]; // Текущий символ ленты.

		if (typeof states[state - 1] == 'undefined') throw('В наборе состояний задан переход в несуществующее состояние ' + state);
		var cmd = states[state - 1][s];
		if (!cmd) throw('В наборе состояний не задано правило для состояния ' + state + ' и символа ' + s + ', но переход в это состояние с этим смиволом произошёл');

		// Печатаем новый символ
		if (s != cmd[0]) {
			data = data.substr(0, pos) + cmd[0] + data.substr(pos + 1);
		}

		// Сдвиг каретки вправо/влево
		pos += cmd[1];

		// Следующее состояние
		state = cmd[2];

		if (stepCallback) stepCallback(data, pos, state);
	}

	return data;
}