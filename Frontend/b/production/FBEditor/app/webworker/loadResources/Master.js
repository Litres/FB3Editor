/**
 * Владелец потока loadResources.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.webworker.loadResources.Master',
	{
		extend: 'FBEditor.webworker.AbstractMaster',

		name: 'loadResources',

		message: function (e)
		{
			var data = e.data,
				manager = FBEditor.webworker.Manager,
				me = manager.getMaster(data.masterName),
				callbackId = data.data.callbackId || null,
				callback;

			//console.log('Поток ' + data.masterName + ' сообщил:', data, me);

			// колбэк
			callback = me.getCallback(callbackId);

			if (callback)
			{
				callback.fn.call(callback.scope, data.data);
			}
		},

		error: function (e)
		{
			var manager = FBEditor.webworker.Manager,
				me = manager.getMaster('loadResources'),
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