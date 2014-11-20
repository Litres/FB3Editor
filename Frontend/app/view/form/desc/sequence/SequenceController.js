/**
 * Контроллер поля серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.SequenceController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.sequence',

		/**
		 * Загружает данные в поля.
		 * @param {Object} df Данные о серии, полученные из книги.
		 */
		onLoadData:  function (df)
		{
			var me = this,
				view = me.getView(),
				container,
				plugin,
				btn;

			console.log(df);
			//me.resetContainer();
			/*plugin = container.getPlugin('fieldcontainerreplicator');
			btn = container.query('button[name=fieldcontainerreplicator-btn-add]')[0];
			console.log(btn);
			Ext.each(
				df,
			    function (item)
			    {
			    }
			);*/
		}
	}
);