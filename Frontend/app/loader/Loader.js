/**
 * Абстрактный класс загрузчика для хаба.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.loader.Loader',
	{
		/**
		 * @property {String} Экшен загрузки.
		 */
		loadAction: null,

		/**
		 * @property {String} Экшен сохранения.
		 */
		saveAction: null,

		/**
		 * @private
		 * @property {String} Адрес сохранения.
		 */
		saveUrl: null,

		/**
		 * @private
		 * @property {String} Адрес загрузки.
		 */
		loadUrl: null,

		/**
		 * @private
		 * @property {Number} Айди произведения на хабе.
		 */
		art: null,

		/**
		 * @private
		 * @property {Object} Менеджер.
		 */
		manager: null,

		/**
		 * @param {Object} [manager] Менеджер.
		 */
		constructor: function (manager)
		{
			var me = this;
			
			me.saveAction = me.saveAction || me.loadAction;
			me.manager = manager;
		},

		/**
		 * Загружает с хаба.
		 * @param {Number} [art] Айди произведениея на хабе.
		 */
		load: function (art)
		{
			throw Error('Нереализован метод FBEditor.loader.Loader#load()');
		},

		/**
		 * Сохраняет на хабе.
		 */
		save: function ()
		{
			throw Error('Нереализован метод FBEditor.loader.Loader#save()');
		},

		/**
		 * Определяет загружается (загружено) ли с хаба.
		 * @return {Boolean}
		 */
		isLoad: function ()
		{
			var me = this,
				url = me.loadUrl,
				res;

			res = url && url !== 'undefined' ? true : false;

			return res;

		},

		/**
		 * Возвращает айди произведения, загружаемого с хаба.
		 * @return {Number}
		 */
		getArt: function ()
		{
			var me = this,
				routeManager = FBEditor.route.Manager,
				art = me.art,
				params;

			params = routeManager.getParams();
			art = art || params.art || params.body_art;

			return art;
		},

		/**
		 * Устанавливает айди произведения.
		 * @param {Number} art
		 */
		setArt: function (art)
		{
			var me = this;

			me.art = art;
			me.loadUrl = me.loadAction + '?art=' + art;
			me.saveUrl = me.saveAction + '?art=' + art;
		},

		/**
		 * Возвращает url для загрузки.
		 * @return {String}
		 */
		getLoadUrl: function ()
		{
			return this.loadUrl;
		},

		/**
		 * Возвращает url для сохранения.
		 * @return {String}
		 */
		getSaveUrl: function ()
		{
			return this.saveUrl;
		}
	}
);