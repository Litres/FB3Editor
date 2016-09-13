/**
 * Менеджер управления потоками Worker.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.webworker.Manager',
	{
		singleton: true,
		requires: [
			'FBEditor.webworker.httpRequest.Master',
			'FBEditor.webworker.xmllint.Master'
		],

		/**
		 * @property {String} Директория хранения потоков.
		 */
		path: 'webworker',

		/**
		 * @config
		 * @property {Object} Список потоков.
		 */
		masters: [
			{
				name: 'xmllint',
				cfg: {},
				_master: null // private
			},
			{
				name: 'httpRequest',
				cfg: {},
				_master: null // private
			},
			{
				name: 'loadResources',
				cfg: {},
				_master: null // private
			}
		],

		/**
		 * Инициализирует все потоки.
		 */
		init: function ()
		{
			var me = this,
				masters = me.masters;

			Ext.Array.each(
				masters,
			    function (item)
			    {
				    var cfg = item.cfg || null;

				    // создаем владельца потока
				    item._master = me.factory(item.name, cfg);
			    }
			);
		},

		/**
		 * Возвращает владельца потока по имени.
		 * @param {String} name Имя потока.
		 * @return {FBEditor.webworker.AbstractMaster}
		 */
		getMaster: function (name)
		{
			var me = this,
				master = null;

			Ext.Array.each(
				me.masters,
			    function (item)
			    {
				    if (item.name === name)
				    {
					    master = item._master;

					    return false;
				    }
			    }
			);

			return master;
		},

		/**
		 * @private
		 * Создает класс управления потоком Master (владельца).
		 * @param {String} name Имя потока.
		 * @param {Object} [cfg] Конфиг для потока.
		 * @return {FBEditor.webworker.AbstractMaster} Владелец потока.
		 */
		factory: function (name, cfg)
		{
			var me = this,
				master,
				clsname;

			clsname = 'FBEditor.' + me.path +  '.' + name + '.Master';

			try
			{
				master = Ext.create(clsname, cfg);
			}
			catch (e)
			{
				Ext.log({msg: 'Ошибка создания владельца потока ' + clsname, level: 'error'});
			}

			return master;
		}
	}
);