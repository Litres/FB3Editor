/**
 * Элемент table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.table.TableElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.table.CreateCommand',
			'FBEditor.editor.element.table.TableElementController',
			'FBEditor.editor.element.table.TableSelection'
		],

		controllerClass: 'FBEditor.editor.element.table.TableElementController',
		selectionClass: 'FBEditor.editor.element.table.TableSelection',
		
		htmlTag: 'table',
		xmlTag: 'table',
		cls: 'el-table',

		isTable: true,

		/**
		 * @param {Array} [size] Размерность таблицы.
		 * @return {Object}
		 */
		createScaffold: function (size)
		{
			var me = this,
				els = {},
				firstP;

			size = size || [0, 0];

			for (var i = 0; i <= size[1]; i++)
			{
				els.tr = FBEditor.editor.Factory.createElement('tr');

				for (var j = 0; j <= size[0]; j++)
				{
					els.td = FBEditor.editor.Factory.createElement('td');
					els.p = FBEditor.editor.Factory.createElement('p');
					els.br = FBEditor.editor.Factory.createElement('br');
					els.p.add(els.br);
					els.td.add(els.p);
					els.tr.add(els.td);

					if (i === 0 && j === 0)
					{
						// запоминаем первый параграф, чтобы потом установить в него курсор
						firstP = els.p;
					}
				}

				me.add(els.tr);
			}

			els.p = firstP;

			return els;
		},

		convertToText: function (fragment)
		{
			var me = this,
				factory = FBEditor.editor.Factory;

			Ext.Array.each(
				me.children,
				function (tr)
				{
					// переносим из td всех потомков в p и добавляем во фрагмент
					Ext.Array.each(
						tr.children,
						function (td)
						{
							var p = factory.createElement('p');

							Ext.Array.each(
								td.children,
								function (child)
								{
									p.add(child);
								}
							);

							fragment.add(p);
						}
					);
				}
			);
		}
	}
);