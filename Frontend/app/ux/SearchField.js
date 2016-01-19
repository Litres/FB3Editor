/**
 * Плагин для поисковых полей, чтобы ставить индикатор загрузки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.ux.SearchField',
	{
		extend: 'Ext.plugin.Abstract',
		alias: 'plugin.searchField',
		pluginId: 'searchField',

		/**
		 * @property {String} Стили индикатора.
		 */
		style: '',

		/**
		 * @private
		 * @property {Ext.dom.Element} Индикатор.
		 */
		loader: null,

		/**
		 * @private
		 * @property {Ext.form.Field} Поле.
		 */
		field: null,

		/**
		 * @private
		 * @property {Boolean} Отображен ли индикатор "ничего не найдено".
		 */
		isEmpty: false,

		translateText: {
			searching: 'Идет поиск...',
			notFound: 'Ничего не найдено'
		},

		constructor: function (config)
		{
			var me = this;

			me.style = me.style || config.style;

			me.callParent(arguments);
		},

		init: function (field)
		{
			var me = this;

			me.field = field;

			field.afterRender = function ()
			{
				me.afterRenderField();
			};

			field.on(
				{
					scope: me,
					blur: me.blurField
				}
			)
		},

		/**
		 * Скрывает индикатор.
		 */
		hideLoader: function ()
		{
			var me = this,
				loader = me.loader;

			me.isEmpty = false;
			loader.hide();

			// меняем индикатор
			loader.replaceCls('fa-check', 'fa-spinner fa-pulse');
			loader.dom.setAttribute('title', me.translateText.searching);
		},

		/**
		 * Показывает индикатор.
		 */
		showLoader: function ()
		{
			var me = this,
				loader = me.loader;

			loader.show();
		},

		/**
		 * Меняет индиактор поиска на "ничего не найдено".
		 */
		emptyLoader: function ()
		{
			var me = this,
				loader = me.loader;

			me.isEmpty = true;

			// меняем индикатор
			loader.replaceCls('fa-spinner fa-pulse', 'fa-check');
			loader.dom.setAttribute('title', me.translateText.notFound);
		},

		/**
		 * @private
		 * Вызывается после потери фокуса полем.
		 */
		blurField: function ()
		{
			var me = this;

			if (me.isEmpty)
			{
				me.hideLoader();
			}
		},

		/**
		 * @private
		 * Вызывается после рендеринга поля.
		 */
		afterRenderField: function ()
		{
			var me = this,
				field = me.field,
				inputWrap = field.inputWrap,
				loader;

			loader = inputWrap.createChild(
				{
					tag: 'i',
					class: 'plugin-searchField-loader fa fa-spinner fa-pulse fa-lg',
					style: me.style
				}
			);
			me.loader = loader;
			me.hideLoader();

			//console.log('loader', inputWrap.getWidth(), inputWrap);

		}
	}
);