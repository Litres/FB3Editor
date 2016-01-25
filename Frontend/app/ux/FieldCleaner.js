/**
 * Плагин "Уборка" для поля.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.ux.FieldCleaner',
	{
		extend: 'Ext.plugin.Abstract',
		alias: 'plugin.fieldCleaner',
		pluginId: 'fieldCleaner',

		/**
		 * @property {String} Стили кнопки.
		 */
		style: '',

		/**
		 * @private
		 * @property {Ext.dom.Element} Кнопка.
		 */
		btn: null,

		/**
		 * @private
		 * @property {Ext.form.Field} Поле.
		 */
		field: null,

		translateText: {
			cleaning: 'Уборка'
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

			field.on(
				{
					scope: me,
					afterrender: me.afterRenderField
				}
			);
		},

		/**
		 * @event beforeFieldCleaner
		 * @event afterFieldCleaner
		 * Обработчик клика по иконке.
		 */
		handler: function ()
		{
			var me = this,
				field = me.field,
				val = field.getValue(),
				descManager = FBEditor.desc.Manager,
				reg = descManager.getRegexpUtf();

			field.fireEvent('beforeFieldCleaner');

			if (val)
			{
				val = val.toLowerCase();
				val = val.replace(reg, '');
				field.setValue(val);
			}

			field.fireEvent('afterFieldCleaner');
		},

		/**
		 * @private
		 * Вызывается после рендеринга поля.
		 */
		afterRenderField: function ()
		{
			var me = this,
				field = me.field,
				btn;

			btn = Ext.dom.Element.create(
				{
					tag: 'i',
					class: 'plugin-fieldCleaner fa fa-paint-brush x-btn x-btn-plain-toolbar-small',
					style: me.style,
					title: me.translateText.cleaning
				}
			);
			me.btn = btn;
			btn.insertAfter(field.inputEl);
			btn.addClsOnClick('x-btn-pressed');
			btn.addClsOnOver('x-btn-over');
			btn.on(
				{
					scope: me,
					click: me.handler
				}
			)
		}
	}
);