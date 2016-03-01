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
		 * @property {Boolean} Преобразовывать ли значение к нижнему регистру.
		 */
		toLowerCase: true,

		/**
		 * @property {Boolean} Капитилизировать ли значение.
		 */
		capitalize: true,

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
		 * Обработчик клика по иконке.
		 */
		handler: function ()
		{
			var me = this,
				field = me.field;

			field.fireEvent('beforeFieldCleaner');

			// конвертируем значение
			me.convertVal();

			field.fireEvent('afterFieldCleaner');
		},

		/**
		 * Преобразует значение.
		 */
		convertVal: function ()
		{
			var me = this,
				field = me.field,
				val = field.getValue(),
				descManager = FBEditor.desc.Manager,
				reg = descManager.getRegexpUtf();


			/* переводит первый символ предложения в верхний регистр */
			function capitalizer (str, tag, val, end)
			{
				str = tag ? tag : '';
				str += Ext.String.capitalize(val) + end;
				str += end === '</p>' ? '' : ' ';

				return str;
			}

			if (val)
			{
				val = me.toLowerCase ? val.toLowerCase() : val;
				val = val.replace(reg, '');
				val = me.capitalize ? val.replace(/(<p>)? *(.+?)([.!?]+|<\/p>|$)/ig, capitalizer) : val;
				val = val.trim();
				field.setValue(val);
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