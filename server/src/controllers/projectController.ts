import { User, ProjectObj } from "../models/User.js";
import { Types } from "mongoose";

//Query functions

export const getProjectById = async (
  _: any,
  {
    clerkUserId,
    projectId,
  }: {
    clerkUserId: string;
    projectId: Types.ObjectId;
  }
) => {
  const user = await User.findOne({ clerkUserId });

  if (!user) {
    throw new Error("User not found");
  }
  const project = user.projects.find(
    (project) =>
      (project._id as Types.ObjectId).toString() === projectId.toString()
  );

  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};

// export const getAllProjects = async (): Promise<ProjectObj[]> => {
//   try {
//     const users = await User.find({}, "projects").exec();

//     const allProjects: ProjectObj[] = users.reduce((acc: ProjectObj[], user) => {

//       if (Array.isArray(user.projects)) {
//         return acc.concat(user.projects);
//       }
//       return acc;
//     }, []);

//     return allProjects;
//   } catch (error: any) {
//     throw new Error("Failed to retrieve projects: " + error.message);
//   }
// };

interface ProjectWithUserDetails extends ProjectObj {
  clerkUserId: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
}

export const getAllProjects = async (): Promise<ProjectWithUserDetails[]> => {
  try {
    const users = await User.find(
      {},
      "clerkUserId firstName lastName profileUrl projects"
    ).exec();

    const allProjects: ProjectWithUserDetails[] = users.reduce(
      (acc: ProjectWithUserDetails[], user) => {
        // Check if the projects array is not empty
        if (user.projects.length > 0) {
          // Add user details to each project
          const userProjects: ProjectWithUserDetails[] = user.projects.map(
            (project) => ({
              _id: project._id,
              projectName: project.projectName,
              tagline: project.tagline,
              description: project.description,
              technologies: project.technologies,
              githubRepoLink: project.githubRepoLink,
              liveLink: project.liveLink,
              images: project.images || [],
              logo: project.logo || "",
              clerkUserId: user.clerkUserId,
              firstName: user.firstName,
              lastName: user.lastName || "",
              profileUrl: user.profileUrl || "",
            })
          );
          return acc.concat(userProjects);
        }
        return acc;
      },
      []
    );

    return allProjects;
  } catch (error: any) {
    throw new Error("Failed to retrieve projects: " + error.message);
  }
};

//######################################################

//Mutation Functions

export const createProject = async (
  _: any,
  {
    clerkUserId,
    projectName,
    tagline,
    description,
    technologies,
    githubRepoLink,
    liveLink,
  }: {
    clerkUserId: string;
    projectName: string;
    tagline: string;
    description: string;
    technologies: string[];
    githubRepoLink: string;
    liveLink: string;
  }
) => {
  const user = await User.findOne({ clerkUserId });

  if (user) {
    const newProject = {
      projectName,
      tagline,
      description,
      technologies,
      githubRepoLink,
      liveLink,
      images: [],
      logo: "",
    };

    user.projects.push(newProject);

    try {
      await user.save();
      // Returning the last added project, which should have the _id
      const savedProject = user.projects[user.projects.length - 1];
      return savedProject;
    } catch (error: any) {
      throw new Error("Failed to save the project: " + error.message);
    }
  } else {
    throw new Error("User not found");
  }
};
