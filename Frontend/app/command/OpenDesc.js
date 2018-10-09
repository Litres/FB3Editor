/**
 * Открывает описание книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.OpenDesc',
	{
		extend: 'FBEditor.command.AbstractCommand',

		/**
		 * @private
		 * @property {Ext.panel.Panel} Активная панель контента.
		 */
		activePanelContent: null,

		/**
		 * @private
		 * @property {Ext.panel.Panel} Активная панель свойств.
		 */
		activePanelProps: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				bridgeWindow = me.getBridgeWindow(),
				bridgeProps = FBEditor.getBridgeProps(),
				result = true,
				content,
				props;

			content = bridgeWindow.Ext.getCmp('panel-main-content');
			me.activePanelContent = content.getLayout().getActiveItem();
			
			content.fireEvent('contentDesc');

			props = bridgeProps.Ext.getCmp('panel-main-props-card');
			me.activePanelProps = props.getLayout().getActiveItem();
			props.fireEvent('activePanelDesc');

			return result;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				activePanelContent = me.activePanelContent,
				activePanelProps = me.activePanelProps,
				bridgeWindow = me.getBridgeWindow(),
				bridgeProps = FBEditor.getBridgeProps(),
				content,
				props;

			content = bridgeWindow.Ext.getCmp('panel-main-content');
			content.setActiveItem(activePanelContent);
			props = bridgeProps.Ext.getCmp('panel-main-props-card');
			props.setActiveItem(activePanelProps);
		}
	}
);