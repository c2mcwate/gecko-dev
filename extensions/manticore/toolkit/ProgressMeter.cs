
namespace Silverstone.Manticore.Toolkit
{
  using System;
  using System.Windows.Forms;
  using System.Drawing;

  /// <summary>
	/// Summary description for Class1.
	/// </summary>
	public class ManticoreProgressMeter : StatusBarPanel
	{
		public ManticoreProgressMeter()
		{
      Console.WriteLine("Progressmeter!");
      this.Style = StatusBarPanelStyle.OwnerDraw;
		}

	}
}
