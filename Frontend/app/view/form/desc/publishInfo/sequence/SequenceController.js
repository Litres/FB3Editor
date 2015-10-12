/**
 * Контроллер Серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.sequence.SequenceController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.publishInfo.sequence',

		onLoadData:  function (data)
		{
			var me = this,
				nextContainer = me.getView(),
				plugin;

			//console.log('sequence', data);

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