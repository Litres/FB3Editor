/**
 * Стандартный формат заголовка, включает обязательный главный заголовок,
 * опциональный подзаголовок и альтернативное название.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.title.Title',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.title.alt.Alt'
		],
		xtype: 'form-desc-title',
		cls: 'form-desc-title',

		checkChangeBuffer: 200,

		/**
		 * @property {Boolean} Необходимо ли показывать подзаголовок.
		 */
		enableSub: true,

		/**
		 * @property {Boolean} Необходимо ли показывать альтернативное название.
		 */
		enableAlt: true,

		/**
		 * @property {Object} Конфиг для поля главного заголовка.
		 */
		mainConfig: {},

		/**
		 * @property {Object} Конфиг для поля подзаголовка.
		 */
		subConfig: {},

		/**
		 * @property {Object} Конфиг для поля альтернативного названия.
		 */
		altConfig: {},

		translateText: {
			main: 'Основное название',
			sub: 'Подзаголовок',
			alt: 'Альтернативное название'
		},

		initComponent: function ()
		{
			var me = this,
				name = me.name,
				items = [],
				main,
				sub,
				alt;

			main = {
				xtype: 'desc-field-text-required',
				checkChangeBuffer: me.checkChangeBuffer,
				name: name + '-main',
				fieldLabel: me.translateText.main,
				keyEnterAsTab: true,
				plugins: {
					ptype: 'fieldCleaner'
				},
				listeners: {
					change: function (field, newVal, oldVal)
					{
						this.ownerCt.fireEvent('changeTitle', field, newVal, oldVal);
					},
					blur: function (field)
					{
						this.ownerCt.fireEvent('blurTitle', field);
					},
					focus: function (field)
					{
						this.ownerCt.fireEvent('focusTitle', field);
					}
				}
			};

			Ext.apply(main, me.mainConfig);
			items.push(main);

			if (me.enableSub)
			{
				sub = {
					xtype: 'textfield',
					name: name + '-sub',
					cls: 'field-optional',
					keyEnterAsTab: true,
					fieldLabel: me.translateText.sub,
					plugins: {
						ptype: 'fieldCleaner'
					}
				};
				items.push(sub);
				Ext.apply(sub, me.subConfig);
			}

			if (me.enableAlt)
			{
				alt = {
					xtype: 'form-desc-title-alt',
					fieldName: name,
					fieldLabelAlt: me.translateText.alt
				};
				items.push(alt);
				Ext.apply(alt, me.altConfig);
			}

			me.items = items;
			me.callParent(arguments);
		},

		/**
		 * Возвращает основное название.
		 * @return {Ext.Component}
		 */
		getMain: function ()
		{
			var me = this,
				name = me.name,
				main;

			main = me.main || me.down('[name=' + name + '-main]');

			return main;
		},

		getValues: function (d)
		{
			var me = this,
				data = d,
				name = me.name,
				values,
				sub,
				alt;

			sub = me.down('[name=' + name + '-sub]');
			alt = me.down('form-desc-title-alt');
			values = {
				main: me.getMain().getValue(),
				sub: sub ? sub.getValue() : null,
				alt: alt ? alt.getValues() : null
			};
			values = me.removeEmptyValues(values);
			if (d)
			{
				data[name] = values;
			}
			else
			{
				data = values;
			}

			return data;
		}
	}
);