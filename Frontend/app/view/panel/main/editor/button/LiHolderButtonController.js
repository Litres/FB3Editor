/**
 * Контроллер кнопки списков, содержащих элементы li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.LiHolderButtonController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',

		onSync: function ()
		{
            var me = this,
                btn = me.getView(),
                manager = btn.getEditorManager(),
                factory = FBEditor.editor.Factory,
                nodes = {},
                els = {},
                name = btn.elementName,
                range,
                xml;

            if (!manager.availableSyncButtons())
            {
                btn.enable();
                return;
            }

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

            els.node = nodes.node.getElement();
            els.p = els.node.getStyleHolder();

            if (!els.p)
            {
                return;
            }

            els.parent = els.p.parent;

            // создаем временный элемент для проверки новой структуры
            els.new = factory.createElement(name);
            els.new.createScaffold();

            //els.parent.children.push(els.newEl);
			els.parent.insertBefore(els.new, els.p);
            els.parent.remove(els.p);

            // получаем xml
            xml = manager.getContent().getXml(true);

            //console.log(name, xml);

            // восстанавливаем абзац и удаляем временный элемент
            els.parent.insertBefore(els.p, els.new);
            els.parent.remove(els.new);

            // проверяем по схеме
            me.verify(xml);
		}
	}
);