/**
 * Контроллер серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.SequenceController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.sequence',

		onLoadData:  function (data)
		{
			var me = this,
				view = me.getView(),
				plugin;

			if (data)
			{
				data = data[0] ? data : {0: data};
				plugin = me.getPluginContainerReplicator(view);
				view.setValues(data, plugin);
			}
		}
	}
);