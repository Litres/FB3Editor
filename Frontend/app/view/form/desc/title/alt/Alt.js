/**
 * Альтернативное название.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.title.alt.Alt',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.title.alt.AltController'
		],
		xtype: 'form-desc-title-alt',
		controller: 'form.desc.title.alt',
		layout: 'hbox',
		cls: 'form-desc-title-alt',
		defaults: {
			anchor: '100%',
			flex: 1,
			labelWidth: 160,
			labelAlign: 'right'
		},

		/**
		 * @property {String} Название метки.
		 */
		fieldLabelAlt: '',

		/**
		 * @property {String} Имя поля.
		 */
		fieldName: '',

		initComponent: function ()
		{
			var me = this,
				name = me.fieldName + '-alt',
				field,
				plugins;

			plugins = {
				ptype: 'fieldcontainerreplicator',
				groupName: name,
				btnStyle: {
					margin: '0 0 0 2px'
				}
			};
			Ext.applyIf(me.plugins, plugins);
			field = {
				xtype: 'textfield',
				name: name,
				fieldLabel: me.fieldLabelAlt,
				cls: 'field-optional',
				keyEnterAsTab: true,
				listeners: {
					loadData: function (data)
					{
						me.fireEvent('loadData', data);
					},
					resize: function (self, width)
					{
						var label,
							span;

						label = self.labelEl;
						span = label.first();

						// исходные параметры метки
						self._label = self._label ? self._label : {width: null, fontSize: null};

						// настраиваем отображение метки в зависимости от ширины поля

						if (width < 300)
						{
							self._label.width = self._label.width || label.getWidth();
							self._label.fontSize = self._label.fontSize || span.getStyle('fontSize');
							//console.log(self._label);
							label.setWidth(100);
							span.setWidth(100);
							span.setStyle('fontSize', '11px');
						}
						else if (self._label.width)
						{
							label.setWidth(self._label.width);
							span.setWidth(self._label.width);
							span.setStyle('fontSize', self._label.fontSize);
						}
					}
				}
			};
			Ext.apply(field, me.fieldConfig);
			me.items = [
				field
			];
			me.callParent(arguments);
		},

		getValues: function ()
		{
			var me = this,
				name = me.fieldName + '-alt',
				data = [],
				items;

			items = me.ownerCt.query('textfield[name=' + name + ']');
			Ext.each(
				items,
				function (item)
				{
					if (item.getValue())
					{
						data.push(item.getValue());
					}
				}
			);

			return data;
		}
	}
);