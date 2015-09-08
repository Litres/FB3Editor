/**
 * Владелец потока xmllint.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.webworker.xmllint.Master',
	{
		extend: 'FBEditor.webworker.AbstractMaster',

		name: 'xmllint',

		message: function (e)
		{
			var data = e.data,
				manager = FBEditor.webworker.Manager,
				me = manager.getMaster(data.masterName),
				callback;

			//console.log('Поток ' + data.masterName + ' сообщил:', data, me);

			// первый колбэк
			callback = me.getCallback();

			if (callback)
			{
				callback.fn.call(callback.scope, data);
			}
		},

		error: function (e)
		{
			var manager = FBEditor.webworker.Manager,
				me = manager.getMaster('xmllint'),
				msg,
				callback;

			msg = 'Ошибка выполнения потока ' + e.filename + ' в строке ' + e.lineno + ': ' + e.message;
			Ext.log({msg: msg, level: 'error'});

			// первый колбэк
			callback = me.getCallback();

			if (callback)
			{
				callback.fn.call(callback.scope, false);
			}
		}

	}
);