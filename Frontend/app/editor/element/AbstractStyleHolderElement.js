/**
 * Абстрактный класс элементов содержащих стилевые элементы.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleHolderElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		cls: 'el-styleholder',

		isStyleHolder: true,
		isStyleType: true,
		showedOnTree: false,

		setAttributesHtml: function (element)
		{
			var me = this,
				el;

			el = me.callParent(arguments);

			// аттрибут необходим для возможности установить фокус на  корневой элемент при необходимости
			//el.setAttribute('tabindex', -1);

			if (Ext.isWebKit)
			{
				// устанавливаем редактируемость элемента
				//el.setAttribute('contentEditable', true);
			}

			return el;
		},

		/**
		 * Удаляет выделенную часть текста.
		 */
		removeRangeNodes: function ()
		{
			var me = this,
				name = me.getName(),
				cmd;

			cmd = Ext.create('FBEditor.editor.command.' + name + '.RemoveRangeNodesCommand');

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		},

		getFormatOptionsXml: function ()
		{
			var me = this,
				existTextChild = false,
				formatOptions;

			formatOptions = me.callParent(arguments);

			// определяем существование текстового потомка
			Ext.Array.each(
				me.children,
				function (child)
				{
					if (child.isText)
					{
						existTextChild = true;
						return true;
					}
				}
			);

			formatOptions.spacesAfter = formatOptions.spacesAfter && !existTextChild ? formatOptions.spacesAfter : '';
			formatOptions.nlBefore = formatOptions.nlBefore && !existTextChild ? formatOptions.nlBefore : '';

			return formatOptions;
		},
		
		/**
		 * @protected
		 * Возвращает первый абзац из следующего элемента.
		 * @return {FBEditor.editor.element.AbstractStyleHolderElement}
		 */
		getNextStyleHolder: function ()
		{
			var me = this,
				els = {};
			
			els.next = me.next();
			els.parent = me.getParent();
			
			while (!els.next && !els.parent.isRoot)
			{
				els.next = els.parent.next();
				els.parent = els.parent.getParent();
			}
			
			els.nextParent = els.next;
			
			if (els.nextParent)
			{
				els.nextDeepFirst = els.nextParent.getDeepFirst();
				els.nextP = els.nextDeepFirst.getStyleHolder();
			}
			
			return els.nextP;
		}
	}
);