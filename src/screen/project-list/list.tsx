export interface Project {
  id: string;
  name: string; //项目名称
  personId: string; //负责人id
  organization: string; //组织
  created: number; //创建时间
}

export interface User {
  id: string;
  name: string; //用户名
}

export interface listProps {
  list: Project[];
  users: User[]; //用户列表，用于显示负责人名称
}

export const List = ({ list, users }: listProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>名称</th>
          <th>负责人</th>
        </tr>
      </thead>

      <tbody>
        {list.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>
              {users.find((user) => user.id === String(project.personId))
                ?.name || "未知"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
