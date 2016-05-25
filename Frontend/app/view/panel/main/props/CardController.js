/**
 * Контроллер внутренней панели свойств.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.CardController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.main.props.card',

		/**
		 * Актвиврует панель свойств редактора ресурсов.
		 */
		onActivePanelResources: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem('panel-props-resources');
		},

		/**
		 * Актвиврует панель свойств редактора текста.
		 */
		onActivePanelBody: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.getEditorManager(),
				cursor,
				root,
				rootNode,
				range;

			view.setActiveItem('panel-props-body');

			// курсор

			range = manager.getRange();

			if (!range || range && !range.start.parentNode)
			{
				root = manager.getContent();
				rootNode = root.getNodeHelper().getNode();
				range = {
					start: manager.getDeepFirst(rootNode)
				};
			}

			cursor = {
				startNode: range.start,
				startOffset: range.offset ? range.offset.start : 0
			};
			manager.setCursor(cursor);
		},

		/**
		 * Актвиврует панель свойств редактора описания книги.
		 */
		onActivePanelDesc: function ()
		{
			var me = this,
				view = me.getView();

			view.setActiveItem('panel-props-desc');
		}
	}
);