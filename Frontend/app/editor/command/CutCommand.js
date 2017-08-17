/**
 * Вырезает данные из текста и вставляет их в буфер обмена.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.CutCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',
		requires: [
			'FBEditor.editor.cutproxy.CutProxy'
		],

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				e = data.e,
				sel = window.getSelection(),
				res = false,
				nodes = {},
				els = {},
				rangeXml,
				manager,
				range,
				proxy;

			try
			{
				range = sel.getRangeAt(0);

				if (range.collapsed)
				{
					return false;
				}

				//console.log('cut', range, e);

				nodes.common = range.commonAncestorContainer;
				els.common = nodes.common.getElement();
				els.p = els.common.getStyleHolder();

				manager = els.common.getManager();

				// получаем xml выделенного фрагмента текста
				rangeXml = manager.getRangeXml();

				// прокси данных из буфера
				proxy = data.proxy || Ext.create('FBEditor.editor.cutproxy.CutProxy', {e: e, manager: manager});
				
				// устанавливаем данные в буфер
				proxy.setData(rangeXml);
				
				// удаляем выделенную часть текста
				if (els.p)
				{
					els.p.fireEvent('keyDownDelete');
				}
				else
				{
					els.common.fireEvent('keyDownDelete');
				}

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			manager.setSuspendEvent(false);

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				nodes = {},
				els = {},
				res = false,
				factory = FBEditor.editor.Factory,
				paste = FBEditor.resource.Manager.getPaste(),
				helper,
				manager,
				range;

		}
	}
);