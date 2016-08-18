/**
 * Информация о бумажной публикации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.PublishInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.publishInfo.PublishInfoController',
			'FBEditor.view.form.desc.publishInfo.item.PublishInfoItem'
		],
		
		id: 'form-desc-publishInfo',
		xtype: 'form-desc-publishInfo',
		controller: 'form.desc.publishInfo',
		name: 'form-desc-plugin-fieldcontainerreplicator',
		
		prefixName: 'paper-publish-info',

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'form-desc-publishInfo-item',
					prefixName: me.prefixName
				}
			];
			
			me.callParent(arguments);
		},

		getValues: function (d)
		{
			var me = this,
				prefixName = me.prefixName,
				items = me.items,
				data = d,
				values = null;

			items.each(
				function (item)
				{
					var val,
						isbn,
						sequence;

					isbn = item.down('form-desc-publishInfo-isbn').getValues();
					sequence = item.down('form-desc-publishInfo-sequence').getValues();
					val = {
						isbn: isbn,
						sequence: sequence,
						_publisher: item.down('[name=' + prefixName + '-publisher]').getValue(),
						_city: item.down('[name=' + prefixName + '-city]').getValue(),
						_year: item.down('[name=' + prefixName + '-year]').getValue(),
						_title: item.down('[name=' + prefixName + '-title]').getValue(),
						'biblio-description': item.down('[name=' + prefixName + '-biblio-description]').getValue()
					};
					val = me.removeEmptyValues(val);

					if (val)
					{
						values = values || [];
						values.push(val);
					}
				}
			);

			if (values)
			{
				data[prefixName] = values;
			}

			return data;
		}
	}
);