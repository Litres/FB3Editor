/**
 * Контроллер альтерантивного названия.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.title.alt.AltController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.title.alt',

		onLoadData:  function (data)
		{
			var me = this,
				nextContainer = me.getView(),
				plugin;

			Ext.Object.each(
				data,
				function (index, obj)
				{
					var field;

					plugin = nextContainer.getPlugin('fieldcontainerreplicator');
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
);