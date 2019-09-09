/**
 * Контроллер кнопки section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.section.SectionController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.section',

		/**
		 * Синхронизирует кнопку, проверяя структуру, не используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				els = {},
				nodes = {},
				range;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();
				return;
			}

			nodes.node = range.common;

			if (!nodes.node.getElement || nodes.node.getElement().isRoot)
			{
				btn.disable();
				return;
			}

			//console.log('range', range);

			els.node = nodes.node.getElement();
			els.parent = els.node.getParent();
			els.parent = els.node.isSection ? els.node : els.node.getParentName('section');
			els.parent = els.parent ? els.parent : els.node.getParentName('main');

			if (!els.parent)
			{
				btn.disable();
				return;
			}
			
			// ищем существующие вложенные секции
			els.sectionCount = els.parent.getChildrenByName('section', true);
			els.isSection = els.sectionCount.length > 1;
			
			if (els.isSection)
			{
				// вложенная секция уже существует
				btn.disable();
				return;
			}

			btn.enable();
		}
	}
);