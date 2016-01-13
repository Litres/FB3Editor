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

		translateText: {
			main: 'Основное название',
			sub: 'Подзаголовок',
			alt: 'Альтернативное название'
		},

		initComponent: function ()
		{
			var me = this,
				name = me.name,
				items = [];

			items.push(
				{
					xtype: 'textfield',
					allowBlank: false,
					checkChangeBuffer: me.checkChangeBuffer,
					name: name + '-main',
					fieldLabel: me.translateText.main,
					cls: 'field-required',
					keyEnterAsTab: true,
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
				}
			);

			if (me.enableSub)
			{
				items.push(
					{
						xtype: 'textfield',
						name: name + '-sub',
						cls: 'field-optional',
						keyEnterAsTab: true,
						fieldLabel: me.translateText.sub
					}
				);
			}

			if (me.enableAlt)
			{
				items.push(
					{
						xtype: 'form-desc-title-alt',
						fieldName: name,
						fieldLabelAlt: me.translateText.alt
					}
				);
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