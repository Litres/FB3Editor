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
				nextContainer = me.getView(),
				plugin;

			//console.log('isbn', data);

			Ext.Object.each(
				data,
				function (index, obj)
				{
					plugin = nextContainer.getPlugin('fieldcontainerreplicator');
					var field = nextContainer.down('textfield');

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
);