/**
 * Авторы, правообладатели и другие имеющие отношение к произведению субьекты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.Subject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.SearchContainer',
			'FBEditor.view.form.desc.relations.subject.CustomContainer'
		],
		id: 'form-desc-relations-subject',
		xtype: 'form-desc-relations-subject',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		translateText: {
			error: 'Необходимо заполнить хотя бы одну персону'
		},

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'desc-fieldcontainer',
					cls: 'desc-fieldcontainer',
					layout: 'hbox',
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'subject',
						btnPos: 'end',
						btnCls: 'plugin-fieldcontainerreplicator-big-btn',
						btnStyle: {
							margin: '0 0 0 5px',
							width: '40px',
							height: '65px'
						}
					},
					listeners: {
						resetContainer: function ()
						{
							var btn;

							// скрываем поля поиска, показываем поля данных
							btn = this.down('form-desc-relations-subject-customBtn');
							btn.switchContainers();
						}
					},
					items: [
						{
							xtype: 'desc-fieldcontainer',
							layout: 'anchor',
							flex: 1,
							items: [
								{
									xtype: 'form-desc-relations-subject-container-custom'
								},
								{
									xtype: 'form-desc-relations-subject-container-search'
								}
							]
						}
					]
				}
			];
			me.callParent(arguments);
		},

		isValid: function ()
		{
			var me = this,
				hiddenCount = 0,
				items = me.query('form-desc-relations-subject-container-custom'),
				combo = me.down('combosearch'),
				isValid = true;

			Ext.Array.each(
				items,
				function (item)
				{
					if (item.isHidden())
					{
						hiddenCount++;
						isValid = true;
					}
					else if (!item.isValid())
					{
						isValid = false;

						return false;
					}
				}
			);

			if (isValid && hiddenCount === items.length)
			{
				// если все поля скрыты
				isValid = false;
				combo.markInvalid(me.translateText.error);
			}

			return isValid;
		},

		getValues: function (d)
		{
			var me = this,
				items = me.items,
				data = d,
				values = null;

			items.each(
				function (item)
				{
					var val;

					val = {
						_id: item.down('[name=relations-subject-id]').getValue(),
						_link: item.down('form-desc-relations-subject-link').getValue(),
						_percent: item.down('[name=relations-subject-percent]').getValue(),
						title: item.down('[name=relations-subject-title]').getValues(),
						'first-name': item.down('[name=relations-subject-first-name]').getValue(),
						'middle-name': item.down('[name=relations-subject-middle-name]').getValue(),
						'last-name': item.down('[name=relations-subject-last-name]').getValue()
					};
					val = me.removeEmptyValues(val);
					if (val && val._id)
					{
						values = values || [];
						values.push(val);
					}
				}
			);
			data['fb3-relations'] = data['fb3-relations'] || {};
			data['fb3-relations'].subject = values;

			return data;
		}
	}
);