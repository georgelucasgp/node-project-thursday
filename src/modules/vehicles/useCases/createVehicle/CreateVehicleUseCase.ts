import { IVehicleModelsRepository } from '@modules/vehicleModel/repositories/IVehicleModelsRepository';
import { ICreateVehicleRequestDTO } from '@modules/vehicles/dtos/ICreateVehicleRequestDTO';
import { Vehicle } from '@modules/vehicles/entities/Vehicle';
import { IVehicleRepository } from '@modules/vehicles/infra/repositories/IVehicleRepository';
import { AppError } from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

@injectable()
class CreateVehicleUseCase {
  constructor(
    @inject('PrismaVehicleRepository')
    private vehicleRepository: IVehicleRepository,
    @inject('PrismaVehicleModelsRepository')
    private vehicleModelsRepository: IVehicleModelsRepository,
  ) {}

  async execute(data: ICreateVehicleRequestDTO) {
    const vehicleAlreadyExists = await this.vehicleRepository.findByLicensePlate(
      data.license_plate,
    );

    if (vehicleAlreadyExists) {
      throw new AppError('Vehicle already Exists', 400);
    }

    const vehicleModelAlreadyExists = await this.vehicleModelsRepository.findById(
      data.vehicles_model_id,
    );

    if (!vehicleModelAlreadyExists) {
      throw new AppError('Vehicle Model does not Exist', 400);
    }

    const vehicleCreate = Vehicle.create(data);

    const vehicle = await this.vehicleRepository.create(vehicleCreate);
    return vehicle;
  }
}

export { CreateVehicleUseCase };
