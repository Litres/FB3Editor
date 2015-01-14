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

		/**
		 * @property {Boolean} Необходимо ли показывать подзаголовок.
		 */
		enableSub: true,

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
					xtype: 'textfieldclear',
					allowBlank: false,
					name: name + '-main',
					fieldLabel: me.translateText.main
				}
			);
			if (me.enableSub)
			{
				items.push(
					{
						xtype: 'textfield',
						name: name + '-sub',
						cls: 'field-optional',
						fieldLabel: me.translateText.sub
					}
				);
			}
			items.push(
				{
					xtype: 'form-desc-title-alt',
					fieldName: name,
					fieldLabelAlt: me.translateText.alt
				}
			);
			me.items = items;
			me.callParent(arguments);
		},

		getValues: function (d)
		{
			var me = this,
				data = d,
				name = me.name,
				val,
				title,
				sub,
				alt;

			title = me.down('[name=' + name + '-main]').getValue();
			sub = me.down('[name=' + name + '-sub]');
			sub = sub ? sub.getValue() : null;
			alt = me.down('form-desc-title-alt');
			alt = alt ? alt.getValues() : null;
			val = {
				main: title
			};
			if (sub)
			{
				val.sub = sub;
			}
			if (!Ext.isEmpty(alt))
			{
				val.alt = alt;
			}
			if (d)
			{
				data[name] = val;
			}
			else
			{
				data = val;
			}

			return data;
		}
	}
);