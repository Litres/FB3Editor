/**
 * Контроллер панели свойств описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.DescController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.desc',

		onAccessHub: function ()
		{
			var me = this,
				view = me.getView(),
				cmpLoadUrl,
				btnLoadUrl;

			cmpLoadUrl = view.down('[name=desc-load-url]');
			cmpLoadUrl.setHidden(false);
			btnLoadUrl = view.down('button-desc-load');
			btnLoadUrl.setHidden(false);
		}
	}
);