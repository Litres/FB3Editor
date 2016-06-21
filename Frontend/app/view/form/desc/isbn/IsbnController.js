/**
 * Контроллер ISBN.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.isbn.IsbnController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.isbn',

		onLoadData:  function (data)
		{
			var me = this,
				nextContainer = me.getView();

			if (data)
			{
				data = Ext.isString(data) ? {0: data} : data;
				Ext.Object.each(
					data,
					function (index, obj)
					{
						var plugin = nextContainer.getPlugin('fieldcontainerreplicator'),
							field = nextContainer.down('textfield');

						if (field)
						{
							field.setValue(obj);
						}

						if (data[parseInt(index) + 1])
						{
							plugin.addFields();
							nextContainer = nextContainer.nextSibling();
						}
					}
				);
			}
		}
	}
);